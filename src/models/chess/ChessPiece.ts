import { ChessBoard } from './ChessBoard';
import { ChessCoordinate, calcChessMatrix, ChessCoordinateMatrix, calcChessCoordinate } from './ChessCoordinate';
import { ChessMove, ChessMoveDirection, ChessMoveRaw } from './ChessMove';
import { ChessPieceColor, ChessPieceSymbol, ChessPieceType } from './ChessPieceType';

export abstract class ChessPieceBase {
    abstract symbol: ChessPieceSymbol;
    abstract pieceType: ChessPieceType;

    color: ChessPieceColor;
    moves: ChessMove[] = [];

    constructor(color: ChessPieceColor) {
        this.color = color;
    }

    abstract getMovesSpecific(originCoord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard): ChessMoveRaw[];

    getMoves(originCoord: ChessCoordinate, chessBoard: ChessBoard): ChessMove[] {
        const originCoordinate = calcChessCoordinate(originCoord);
        const direction = this.getDirection(chessBoard);

        const rawMoves = this.getMovesSpecific(originCoordinate, direction, chessBoard);
        const moves: ChessMove[] = [];

        for (let move of rawMoves) {
            // FILTER

            const targetSquare = chessBoard.getSquare(move.targetCoordinate);
            const capture = targetSquare.piece;
    
            // Piece of same color
            if (capture?.color === this.color) continue;

            // MAP

            moves.push({
                piece: this,
                originCoordinate: originCoord,
                targetCoordinate: move.targetCoordinate,
                capture: capture,
                sideEffects: move.sideEffects,
            });
        }
        
        return moves;
    }

    getDirection(chessBoard: ChessBoard) {
        return this.color === chessBoard.initColor ? -1 : 1;
    }

    projectPath(coord: ChessCoordinateMatrix, nextCoord: ChessCoordinateMatrix, chessBoard: ChessBoard) {
        let coords: ChessCoordinateMatrix[] = [];

        const castDirection = (direction: number) => direction > 0 ? 1 : direction < 0 ? -1 : 0;

        const rowDirection = castDirection(nextCoord.rowIndex - coord.rowIndex);
        const colDirection = castDirection(nextCoord.colIndex - coord.colIndex);

        let count = 1;
        while (true) {
            const newCoord = calcChessMatrix(coord.rowIndex + rowDirection * count, coord.colIndex + colDirection * count);
            if (newCoord == null) break;

            coords.push(newCoord);

            const square = chessBoard.getSquare(newCoord.coordinate);
            if (square.piece != null) break;

            count++;
        }

        return coords;
    }
}

export class ChessPiecePawn extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Pawn;
    pieceType: ChessPieceType = ChessPieceType.Pawn;

    getMovesSpecific(coord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Forward

        const forwardCoord = calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex);

        if (forwardCoord != null) {
            const forwardSquare = chessBoard.getSquare(forwardCoord.coordinate);
            if (forwardSquare.piece == null)
                moves.push(new ChessMoveRaw(forwardCoord.coordinate));
        }

        // Double Forward

        if (this.moves.length === 0) {
            const doubleForwardCoord = calcChessMatrix(coord.rowIndex + (2 * direction), coord.colIndex);
            if (doubleForwardCoord != null) {
                const doubleForwardSquare = chessBoard.getSquare(doubleForwardCoord.coordinate);
                if (doubleForwardSquare.piece == null)
                    moves.push(new ChessMoveRaw(doubleForwardCoord.coordinate));
            }
        }

        // Diagonal

        const diagonalRightCoord = calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex + (1 * direction));

        if (diagonalRightCoord != null) {
            const diagonalRightSquare = chessBoard.getSquare(diagonalRightCoord.coordinate);
            if (diagonalRightSquare?.piece && diagonalRightSquare?.piece?.color !== this.color)
                moves.push(new ChessMoveRaw(diagonalRightCoord.coordinate));
        }

        const diagonalLeftCoord = calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex - (1 * direction));

        if (diagonalLeftCoord != null) {
            const diagonalLeftSquare = chessBoard.getSquare(diagonalLeftCoord.coordinate);
            if (diagonalLeftSquare?.piece && diagonalLeftSquare?.piece?.color !== this.color)
                moves.push(new ChessMoveRaw(diagonalLeftCoord.coordinate));
        }

        // Moves

        return moves;
    }
}

export class ChessPieceKing extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.King;
    pieceType: ChessPieceType = ChessPieceType.King;

    getMovesSpecific(coord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Single

        const singleMoves: (ChessCoordinateMatrix | undefined)[] = [
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex),
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex, coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex - (1 * direction)),
            calcChessMatrix(coord.rowIndex, coord.colIndex - (1 * direction)),
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex - (1 * direction)),
        ];

        for (let singleCoord of singleMoves) {
            if (singleCoord != null) moves.push(new ChessMoveRaw(singleCoord.coordinate));
        }

        // Castling

        if (this.moves.length === 0) {
            // Queenside Castling

            const queenRookCoord = calcChessCoordinate(this.color === ChessPieceColor.White ? ChessCoordinate.h8 : ChessCoordinate.h1);
            const queenRookSquare = chessBoard.getSquare(queenRookCoord.coordinate, 0);

            // TODO: fix disable castling when rook has moved
            if (queenRookSquare.piece?.moves?.length === 0) {
                const path = this.projectPath(coord, queenRookCoord, chessBoard);
                const isPathClear = path.length === 4 && path.slice(0, 3).every(e => chessBoard.getSquare(e.coordinate).piece == null);

                if (isPathClear) {
                    const queenBishopSquare = chessBoard.getSquare(path[0].coordinate);
                    const queenKnightSquare = chessBoard.getSquare(path[1].coordinate);

                    const rookSideEffect = new ChessMove(queenRookSquare.piece, queenRookSquare.coordinate, queenBishopSquare.coordinate);
                    moves.push(new ChessMoveRaw(queenKnightSquare.coordinate, [rookSideEffect]));
                }
            }

            // Kingside Castling

            const kingRookCoord = calcChessCoordinate(this.color === ChessPieceColor.White ? ChessCoordinate.a8 : ChessCoordinate.a1);
            const kingRookSquare = chessBoard.getSquare(kingRookCoord.coordinate, 0);

            // TODO: fix disable castling when rook has moved
            if (kingRookSquare.piece?.moves?.length === 0) {
                const path = this.projectPath(coord, kingRookCoord, chessBoard);

                const isPathClear = path.length === 3 && path.slice(0, 2).every(e => chessBoard.getSquare(e.coordinate).piece == null);

                if (isPathClear) {
                    const kingBishopSquare = chessBoard.getSquare(path[0].coordinate);
                    const kingKnightSquare = chessBoard.getSquare(path[1].coordinate);

                    const rookSideEffect = new ChessMove(kingRookSquare.piece, kingRookSquare.coordinate, kingBishopSquare.coordinate);
                    moves.push(new ChessMoveRaw(kingKnightSquare.coordinate, [rookSideEffect]));
                }
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceQueen extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Queen;
    pieceType: ChessPieceType = ChessPieceType.Queen;

    getMovesSpecific(coord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        // TODO: promote to queen

        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinateMatrix | undefined)[] = [
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex),
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex, coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex - (1 * direction)),
            calcChessMatrix(coord.rowIndex, coord.colIndex - (1 * direction)),
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex - (1 * direction)),
        ];

        for (let multiCoord of multiMoves) {
            if (multiCoord != null) {
                const path = this.projectPath(coord, multiCoord, chessBoard);
                path.forEach(e => moves.push(new ChessMoveRaw(e.coordinate)));
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceRook extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Rook;
    pieceType: ChessPieceType = ChessPieceType.Rook;

    getMovesSpecific(coord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinateMatrix | undefined)[] = [
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex),
            calcChessMatrix(coord.rowIndex, coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex),
            calcChessMatrix(coord.rowIndex, coord.colIndex - (1 * direction)),
        ];

        for (let multiCoord of multiMoves) {
            if (multiCoord != null) {
                const path = this.projectPath(coord, multiCoord, chessBoard);
                path.forEach(e => moves.push(new ChessMoveRaw(e.coordinate)));
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceBishop extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Bishop;
    pieceType: ChessPieceType = ChessPieceType.Bishop;

    getMovesSpecific(coord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinateMatrix | undefined)[] = [
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex - (1 * direction)),
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex - (1 * direction)),
        ];

        for (let multiCoord of multiMoves) {
            if (multiCoord != null) {
                const path = this.projectPath(coord, multiCoord, chessBoard);
                path.forEach(e => moves.push(new ChessMoveRaw(e.coordinate)));
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceKnight extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Knight;
    pieceType: ChessPieceType = ChessPieceType.Knight;

    getMovesSpecific(coord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // L
        
        const lMoves: (ChessCoordinateMatrix | undefined)[] = [
            calcChessMatrix(coord.rowIndex + (2 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (2 * direction), coord.colIndex + (1 * direction)),
            calcChessMatrix(coord.rowIndex - (2 * direction), coord.colIndex - (1 * direction)),
            calcChessMatrix(coord.rowIndex + (2 * direction), coord.colIndex - (1 * direction)),
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex + (2 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex + (2 * direction)),
            calcChessMatrix(coord.rowIndex - (1 * direction), coord.colIndex - (2 * direction)),
            calcChessMatrix(coord.rowIndex + (1 * direction), coord.colIndex - (2 * direction)),
        ];

        for (let lCoord of lMoves) {
            if (lCoord != null) moves.push(new ChessMoveRaw(lCoord.coordinate));
        }

        return moves;
    }
}
