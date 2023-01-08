import { calcChessCoordinate, calcChessCoordinateByCode, chessBoardMatrixDict } from '@/models/chess/ChessBoardMatrix';
import { ChessBoardMatrix, ChessBoardSnapshot } from '@/models/chess/ChessBoardSnapshot';
import { EnumDictionary } from '@/utils';
import { cloneDeep } from 'lodash-es';
import { ChessCoordinate, ChessCoordinateCode } from './ChessCoordinate';
import { ChessMove, ChessMoveSafe, ChessMoveWarning } from './ChessMove';
import { ChessPiece } from './ChessPiece';
import { ChessPieceColor, ChessPieceName } from './ChessPieceType';
import { ChessSquare } from './ChessSquare';

export class ChessBoard {
    playerColor: ChessPieceColor;

    moves: ChessMove[] = [];
    movesIndex: EnumDictionary<ChessPieceName, ChessMove[]> = {};

    snapshots: ChessBoardSnapshot[];

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

    constructor(playerColor: ChessPieceColor, chessBoard?: ChessBoard) {
        this.playerColor = playerColor;
        this.snapshots = chessBoard?.snapshots ?? [initBoardSnapshot(), initBoardSnapshot()]; // Initial + First Move
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
        return this.board.piecesIndex[pieceName];
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
        if (square.piece == null) return;
        if (square.piece.color !== this.board.playingColor) return;
        let moves = square.piece.getMoves(square.coordinate, this);
        return moves;
    }

    async movePiece(move: ChessMove) {
        // TODO: ensure move wont cause a checkmate

        const moves = [move, ...(move.sideEffects ?? [])];

        for (let m of moves) {
            const square = this.getSquare(m.originCoordinate);
            const piece = square.piece;
    
            if (piece == null) throw new Error(`Invalid movement, no piece at ${square.coordinate}`);
            if (piece.color !== this.board.playingColor) throw new Error(`Invalid movement, wrong piece color: ${piece.color}`);
    
            const targetSquare = this.getSquare(m.targetCoordinate);
            const capture = targetSquare.piece;
    
            if (capture?.color === piece.color) throw new Error(`Invalid movement, cannot capture pieces of same color at ${m.targetCoordinate}`);
    
            square.piece = undefined;
            targetSquare.piece = piece;
        }

        this.pushMove(move);
    }

    pushMove(move: ChessMove) {
        // ADD/INDEX MOVE

        this.moves.unshift(move);

        const pieceName = move.piece.getName();
        if (this.movesIndex[pieceName] == null) this.movesIndex[pieceName] = [];
        this.movesIndex[pieceName]!.push(move);

        // SAVE SNAPSHOT

        this.snapshots.push({
            matrix: cloneDeep(this.board.matrix),
            piecesIndex: getPiecesIndex(this.board.matrix),
            playingColor: this.reverseColor(this.board.playingColor),
        });

        // VERIFY CHECK

        const check = this.verifyCheck();

        if (check !== ChessMoveWarning.None) alert(check);
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

    verifyCheck(): ChessMoveWarning {
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

        // TODO: Stalemate

        const selfNextMoves = this.getAllNextMoves(this.board.playingColor);
        const enemyNextMoves = this.getAllNextMoves(this.reverseColor(this.board.playingColor));
console.log('enemyNextMoves', enemyNextMoves);

        const kingSquare = this.getSquareByPieceColor(this.board.playingColor, ChessPieceName.e1WhiteKing, ChessPieceName.e8BlackKing);

        if (kingSquare?.piece == null) throw new Error('King not found');

        // Any next enemy move that will capture the king
        const checks = enemyNextMoves.filter(e => e.capture?.getName() === kingSquare.piece!.getName());
console.log('checks', checks);

        if (checks.length > 0) {
            const nextKingMoves = selfNextMoves.filter(e => e.piece.getName() === kingSquare.piece!.getName());
console.log('nextKingMoves', nextKingMoves);

            let safeMoves: [ChessMoveSafe, ChessMove][] = [];

            for (let nextKingMove of nextKingMoves) { // TODO: check if new move won't create new check
                // Check if any king movement will kill the enemy or escape enemy capturing territory
                const checkSafe = enemyNextMoves.every(e => e.targetCoordinate !== nextKingMove.targetCoordinate || nextKingMove.targetCoordinate === e.originCoordinate);
                if (checkSafe) safeMoves.push([ChessMoveSafe.KingMove, nextKingMove]);
            }

            const nextOtherMoves = selfNextMoves.filter(e => e.piece.getName() !== kingSquare.piece!.getName());

            for (let nextOtherMove of nextOtherMoves) { // TODO: check if new move won't create new check
                // Check if any friendly movement will kill the enemy or obstruct the enemy's path

                const checkSafeByKill = checks.every(e => nextOtherMove.targetCoordinate === e.originCoordinate);
                if (checkSafeByKill) safeMoves.push([ChessMoveSafe.PieceKill, nextOtherMove]);

                const checkSafeByObstruction = checks.every(e => this.projectPath(e.originCoordinate, e.targetCoordinate).includes(nextOtherMove.targetCoordinate));
                if (checkSafeByObstruction) safeMoves.push([ChessMoveSafe.PieceObstruction, nextOtherMove]);
            }

console.log('safeMoves', safeMoves);
            return safeMoves.length > 0 ? ChessMoveWarning.Check : ChessMoveWarning.Checkmate;
        }

        return ChessMoveWarning.None;
    }

    // verifyCheck(): ChessMoveWarning | null {
    //     // TODO: verify Stalemate

    //     const selfNextMoves = this.getAllNextMoves(this.board.playingColor);
    //     const enemyNextMoves = this.getAllNextMoves(this.reverseColor(this.board.playingColor));

    //     const kingSquare = this.board.matrix.flat().find(e => e.piece?.type === ChessPieceType.King && e.piece?.color === this.board.playingColor);

    //     if (kingSquare?.piece == null) throw new Error('King not found');

    //     const hasCheck = enemyNextMoves.some(e => e.targetCoordinate === kingSquare.coordinate);

    //     // TODO: check if other piece can kill the attacker

    //     if (hasCheck) {
    //         const nextKingMoves = kingSquare.piece.getMoves(kingSquare.coordinate, this);
    //         nextKingMoves.unshift(new ChessMove(kingSquare.piece, kingSquare.coordinate, kingSquare.coordinate));

    //         let isCheckMate = true;

    //         for (let move of nextKingMoves) {
    //             const possibleChecks = enemyNextMoves.filter(e => e.targetCoordinate === move.targetCoordinate);

    //             // TODO: selfNextMoves can be used only once per piece (one piece can't kill 2 others)
    //             const isCheck = possibleChecks.length > 0;
    //             const areKillableNow = possibleChecks.every(e => selfNextMoves.some(f => e.originCoordinate === f.targetCoordinate));
    //             const areKillableNext = possibleChecks.every(e => selfNextMoves.some(f => e.targetCoordinate === f.targetCoordinate));

    //             isCheckMate = isCheckMate && (isCheck && !(areKillableNow || areKillableNext));

    //             if (!isCheckMate) return ChessMoveWarning.Check;
    //         }

    //         return isCheckMate ? ChessMoveWarning.Checkmate : ChessMoveWarning.Check;
    //     }

    //     return hasCheck ? ChessMoveWarning.Check : null;
    // }

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

function initBoardSnapshot(): ChessBoardSnapshot {
    const boardMatrix: ChessBoardMatrix = [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => new ChessSquare(i, j, chessBoardMatrixDict[calcChessCoordinate(i, j, true)!.code]?.piece)));

    return {
        playingColor: ChessPieceColor.White,
        matrix: boardMatrix,
        piecesIndex: getPiecesIndex(boardMatrix),
    };
}

function getPiecesIndex(boardMatrix: ChessBoardMatrix) {
    return boardMatrix.flat().filter(e => e.piece != null).reduce((acc, val) => ({ ...acc, [val.piece!.getName()]: val }), {} as EnumDictionary<ChessPieceName, ChessSquare>);
}
