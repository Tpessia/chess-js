import { calcChessCoordinate, calcChessCoordinateByCode, initBoardMatrix } from '@/models/chess/ChessBoardMatrix';
import { ChessBoardSnapshot } from '@/models/chess/ChessBoardSnapshot';
import { ChessCheck, ChessCheckMoveType, ChessCheckType } from '@/models/chess/ChessCheck';
import { EnumDictionary } from '@/utils';
import { cloneDeep } from 'lodash-es';
import memoize from 'memoizee';
import { ChessCoordinate, ChessCoordinateCode } from './ChessCoordinate';
import { ChessMove } from './ChessMove';
import { ChessPiece, ChessPiecePawn, ChessPieceQueen } from './ChessPiece';
import { ChessPieceColor, ChessPieceName } from './ChessPieceType';
import { ChessSquare } from './ChessSquare';

export class ChessBoard {
    playerColor: ChessPieceColor;

    snapshots: ChessBoardSnapshot[];
    undoneSnapshots: ChessBoardSnapshot[] = [];

    isSimulating: boolean = false;

    constructor(playerColor: ChessPieceColor, chessBoard?: ChessBoard) {
        this.playerColor = playerColor;
        this.snapshots = chessBoard?.snapshots ?? [
            new ChessBoardSnapshot(ChessPieceColor.White, initBoardMatrix()), // Prestine board for reference
            new ChessBoardSnapshot(ChessPieceColor.White, initBoardMatrix()), // Playable board
        ];
    }

    // Accessors

    moves = () => this.movesFn(this.snapshots);
    private movesFn = memoize((snapshots: ChessBoardSnapshot[]) => snapshots.filter(e => e?.move != null).map(e => e.move as ChessMove), { primitive: true, max: 1 });

    movesIndex = () => this.movesIndexFn(this.moves());
    private movesIndexFn = memoize((moves: ChessMove[]) => moves.reduce((acc, val) => {
        const pieceName = val.piece.getName();
        if (acc[pieceName] == null) acc[pieceName] = [];
        acc[pieceName]!.push(val);
        return acc;
    }, {} as EnumDictionary<ChessPieceName, ChessMove[]>), { primitive: true, max: 1 });

    get board() {
        return this.snapshots[this.snapshots.length - 1];
    }

    get boardView() {
        let boardMatrix = this.board.matrix;

        if (this.playerColor === ChessPieceColor.Black) {
            boardMatrix = boardMatrix.slice().reverse();
            boardMatrix = boardMatrix.map(e => e.slice().reverse());
        }

        return boardMatrix;
    }

    get canUndoMove() {
        return this.snapshots.length > 2;
    }

    get canRedoMove() {
        return this.undoneSnapshots.length > 0;
    }

    get isFinished() {
        return this.board.check?.type === ChessCheckType.Checkmate || this.board.check?.type === ChessCheckType.Stalemate;
    }

    // Squares

    getSquare(coord: ChessCoordinate, snapshotIndex?: number) {
        return this.getSquareByIndex(coord.rowIndex, coord.colIndex, snapshotIndex);
    }

    getSquareByCode(coordCode: ChessCoordinateCode, snapshotIndex?: number) {
        const { rowIndex, colIndex } = calcChessCoordinateByCode(coordCode);
        return this.getSquareByIndex(rowIndex, colIndex, snapshotIndex);
    }

    getSquareByIndex(rowIndex: number, colIndex: number, snapshotIndex?: number) {
        return this.snapshots[snapshotIndex ?? this.snapshots.length - 1]?.matrix?.[rowIndex]?.[colIndex];
    }

    getSquareByPiece(pieceName: ChessPieceName) {
        return this.board.piecesIndex()[pieceName];
    }

    getSquareByPieceColor(color: ChessPieceColor, nameWhite: ChessPieceName, nameBlack: ChessPieceName) {
        const pieceName = color === ChessPieceColor.White ? nameWhite : nameBlack;
        return this.getSquareByPiece(pieceName);
    }

    // Pieces

    addPiece(piece: ChessPiece, coord: ChessCoordinateCode) {
        const square = this.getSquareByCode(coord);
        square.piece = piece;
    }

    // Moves

    getMoves(square: ChessSquare) {
        if (this.isFinished) return;
        if (square.piece == null) return;
        if (square.piece.color !== this.board.playingColor) return;
        let moves = square.piece.getMoves(square.coordinate, this);
        return moves;
    }

    movePiece(move: ChessMove) {
        if (this.isFinished) return;

        const moves = [move, ...(move.sideEffects ?? [])];

        for (let m of moves) {
            const square = this.getSquare(m.originCoordinate);
            const piece = square.piece;
    
            if (piece == null) throw new Error(`Invalid movement, no piece at ${square.coordinate.code}`);
            if (piece.color !== this.board.playingColor) throw new Error(`Invalid movement, wrong piece color: ${piece.color}`);
    
            const targetSquare = this.getSquare(m.targetCoordinate);
            const capture = targetSquare.piece;

            if (capture?.color === piece.color) throw new Error(`Invalid movement, cannot capture pieces of same color at ${m.targetCoordinate}`);
    
            square.piece = undefined;
            targetSquare.piece = piece;
        }

        // SAVE MOVE

        this.saveMove(move);

        if (!this.isSimulating) { // TODO: improve isSimulation check logic
            this.undoneSnapshots = [];
        }
    }

    saveMove(move?: ChessMove) {
        this.board.move = move;

        const newSnapshot = new ChessBoardSnapshot(this.snapshots.length > 1 ? this.reverseColor(this.board.playingColor) : this.board.playingColor, cloneDeep(this.board.matrix));
        this.snapshots.push(newSnapshot); // Push empty board

        if (!this.isSimulating) { // TODO: improve isSimulation check logic
            const check = this.getCheck();
            this.board.check = check; // TODO: workaround because of undoMove usage on this.getCheck (it resets the real snapshot on second pop)
            if (this.board.check?.type != null) alert(this.board.check.type);
        }

        // Promote to Queen
        // TODO: migrate logic to ChessPiece.ts

        if (move?.piece instanceof ChessPiecePawn) {
            const shouldPromote = move.piece.color === ChessPieceColor.Black && move.targetCoordinate.rowIndex === 7 || move.piece.color === ChessPieceColor.White && move.targetCoordinate.rowIndex === 0;
            if (shouldPromote) {
                const pawnSquare = this.getSquare(move.targetCoordinate);
                pawnSquare.piece = new ChessPieceQueen(move.piece.color, move.targetCoordinate.code);
            }
        }
    }

    undoMove() {
        // POP SNAPSHOT

        if (!this.canUndoMove) return;

        this.snapshots.pop()!; // Remove empty board
        const snapshot = this.snapshots.pop()!; // Pop last move

        // SAVE UNDO

        if (!this.isSimulating) { // TODO: improve isSimulation check logic
            this.undoneSnapshots.push(snapshot);
        }

        // SAVE MOVE

        this.saveMove(this.board.move); // Push new snapshot
    }

    redoMove() {
        // PUSH SNAPSHOT

        if (!this.canRedoMove) return;

        const snapshot = this.undoneSnapshots.pop()!;
        this.snapshots.pop()!; // Remove empty board
        this.snapshots.push(snapshot); // Push redo
        this.saveMove(snapshot.move);
    }

    getAllNextMoves(color?: ChessPieceColor) {
        const flatBoard = this.board.matrix.flat();
        const moves: ChessMove[] = [];

        for (let square of flatBoard) {
            if (square.piece == null) continue;
            if (square.piece.color != null && square.piece.color !== color) continue;
            const squareMoves = square.piece.getMoves(square.coordinate, this);
            moves.push(...(squareMoves ?? []));
        }

        return moves;
    }

    getCheck(): ChessCheck | undefined {
        // CHECK
        // Check:
        // - Any next enemy move will capture king
        // Checkmate:
        // - Any next enemy move will capture king
        // - Any king movement won't kill the enemy and/or escape enemy capturing territory
        // - Any friendly movement won't kill the enemy and/or obstruct the enemy's path
        // Stalemate:
        // - Any king movement will result in checkmate, but king is not currently under check

        // *Checkmate brute-force:
        // - When under Check loop over every possible friendly movement and check if all still result in check

        const selfNextMoves = this.getAllNextMoves(this.board.playingColor);
        const enemyNextMoves = this.getAllNextMoves(this.reverseColor(this.board.playingColor));

        const kingSquare = this.getSquareByPieceColor(this.board.playingColor, ChessPieceName.e1WhiteKing, ChessPieceName.e8BlackKing);

        if (kingSquare?.piece == null) throw new Error('King not found');

        // Any next enemy move that will capture the king
        const checks = enemyNextMoves.filter(e => e.capture?.getName() === kingSquare.piece!.getName());

        const validateCheckmate = () => {
            // https://www.chess.com/terms/scholars-mate-chess

            const check: ChessCheck = {
                type: ChessCheckType.Check,
                safeMoves: [],
            };

            // Check if any king movement will kill the enemy or escape enemy capturing territory

            const nextKingMoves = selfNextMoves.filter(e => e.piece.getName() === kingSquare.piece!.getName());

            for (let nextKingMove of nextKingMoves) {
                const checkSafe = enemyNextMoves.every(e => e.targetCoordinate !== nextKingMove.targetCoordinate || nextKingMove.targetCoordinate === e.originCoordinate);
                if (checkSafe) check.safeMoves.push({ type: ChessCheckMoveType.KingMove, move: nextKingMove });
            }

            // Check if any friendly movement will kill the enemy or obstruct the enemy's path

            const nextOtherMoves = selfNextMoves.filter(e => e.piece.getName() !== kingSquare.piece!.getName());

            for (let nextOtherMove of nextOtherMoves) {
                const checkSafeByKill = checks.every(e => nextOtherMove.targetCoordinate === e.originCoordinate);
                if (checkSafeByKill) check.safeMoves.push({ type: ChessCheckMoveType.PieceKill, move: nextOtherMove });

                const checkSafeByObstruction = checks.every(e => this.projectPath(e.originCoordinate, e.targetCoordinate).includes(nextOtherMove.targetCoordinate));
                if (checkSafeByObstruction) check.safeMoves.push({ type: ChessCheckMoveType.PieceObstruction, move: nextOtherMove });
            }

            // Check if new move won't create new check (simulate move then undo)

            if (!this.isSimulating) { // Prevent recursive getCheck() call
                this.isSimulating = true;

                for (let simulateMove of [...check.safeMoves]) {
                    this.movePiece(simulateMove.move);

                    // Fake color to verify check again
                    this.board.playingColor = this.reverseColor(this.board.playingColor);
                    const reCheck = this.getCheck();

                    // New move causes new check
                    if (reCheck != null) {
                        check.safeMoves = check.safeMoves.filter(e => e !== simulateMove);
                    }

                    this.undoMove();
                }

                this.isSimulating = false;
            }

            if (check.safeMoves.length === 0) check.type = ChessCheckType.Checkmate;

            return check;
        };

        const validateStalemate = () => {
            // https://www.chess.com/forum/view/game-showcase/fastest-stalemate-known-in-chess

            const check: ChessCheck = {
                type: ChessCheckType.Stalemate,
                safeMoves: [],
            };

            const nextKingMoves = selfNextMoves.filter(e => e.piece.getName() === kingSquare.piece!.getName());

            let movesCheck: (ChessCheck | undefined)[] = [];

            if (!this.isSimulating) { // Prevent recursive getCheck() call
                this.isSimulating = true;

                for (let nextKingMove of nextKingMoves) {
                    this.movePiece(nextKingMove);

                    // Fake color to verify check again
                    this.board.playingColor = this.reverseColor(this.board.playingColor);
                    const reCheck = this.getCheck();

                    movesCheck.push(reCheck);

                    this.undoMove();
                }

                this.isSimulating = false;
            }

            const isStalemate = movesCheck.length > 0 && movesCheck.every(e => e != null);

            return isStalemate ? check : undefined;
        };

        if (checks.length > 0) return validateCheckmate();
        else return validateStalemate();
    }

    // Simulate

    projectPath(coord: ChessCoordinate, nextCoord: ChessCoordinate) {
        let coords: ChessCoordinate[] = [];

        const castDirection = (direction: number) => direction > 0 ? 1 : direction < 0 ? -1 : 0;

        const rowDirection = castDirection(nextCoord.rowIndex - coord.rowIndex);
        const colDirection = castDirection(nextCoord.colIndex - coord.colIndex);

        let count = 1;
        while (true) {
            const newCoord = calcChessCoordinate(coord.rowIndex + rowDirection * count, coord.colIndex + colDirection * count);
            if (newCoord == null) break;

            coords.push(newCoord);

            const square = this.getSquareByCode(newCoord.code);
            if (square.piece != null) break;

            count++;
        }

        return coords;
    }

    // Utils

    toString() {
        return this.board.matrix.map(e => e.map(f => f.piece?.symbol ?? '.').join(' ')).join('\n');
    }

    private reverseColor(color: ChessPieceColor) {
        return color === ChessPieceColor.White ? ChessPieceColor.Black : ChessPieceColor.White;
    }
}
