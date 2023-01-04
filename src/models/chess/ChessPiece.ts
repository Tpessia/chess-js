import { ChessBoard } from './ChessBoard';
import { ChessCoordinate, chessCoordinateFromMatrix, ChessCoordinateMatrix, chessCoordinateToMatrix } from './ChessCoordinate';
import { ChessMove, ChessMoveDirection, ChessMoveRaw } from './ChessMove';
import { ChessPieceColor, ChessPieceSymbol, ChessPieceType } from './ChessPieceType';

export abstract class ChessPieceBase {
    abstract symbol: ChessPieceSymbol;
    abstract pieceType: ChessPieceType;

    moves: ChessMove[] = [];
    color: ChessPieceColor;

    constructor(color: ChessPieceColor) {
        this.color = color;
    }

    abstract getMovesSpecific(originCoord: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard): ChessMoveRaw[];

    getMoves(originCoord: ChessCoordinate, chessBoard: ChessBoard): ChessMove[] {
        const originCoordinate = chessCoordinateToMatrix(originCoord);
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
}

export class ChessPiecePawn extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Pawn;
    pieceType: ChessPieceType = ChessPieceType.Pawn;

    getMovesSpecific({ rowIndex, colIndex }: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Forward

        const forwardCoord = chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex);

        if (forwardCoord != null) {
            const forwardSquare = chessBoard.getSquare(forwardCoord.coordinate);
            if (forwardSquare.piece == null)
                moves.push(new ChessMoveRaw(forwardCoord.coordinate));
        }

        // Double Forward

        if (this.moves.length === 0) {
            const doubleForwardCoord = chessCoordinateFromMatrix(rowIndex + (2 * direction), colIndex);
            if (doubleForwardCoord != null) {
                const doubleForwardSquare = chessBoard.getSquare(doubleForwardCoord.coordinate);
                if (doubleForwardSquare.piece == null)
                    moves.push(new ChessMoveRaw(doubleForwardCoord.coordinate));
            }
        }

        // Diagonal

        const diagonalRightCoord = chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex + (1 * direction));

        if (diagonalRightCoord != null) {
            const diagonalRightSquare = chessBoard.getSquare(diagonalRightCoord.coordinate);
            if (diagonalRightSquare?.piece && diagonalRightSquare?.piece?.color !== this.color)
                moves.push(new ChessMoveRaw(diagonalRightCoord.coordinate));
        }

        const diagonalLeftCoord = chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex - (1 * direction));

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

    getMovesSpecific({ rowIndex, colIndex }: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Single

        const singleMoves: (ChessCoordinateMatrix | undefined)[] = [
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex),
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex, colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex - (1 * direction)),
            chessCoordinateFromMatrix(rowIndex, colIndex - (1 * direction)),
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex - (1 * direction)),
        ];

        for (let coord of singleMoves) {
            if (coord != null) moves.push(new ChessMoveRaw(coord.coordinate));
        }

        // Moves

        return moves;
    }
}

export class ChessPieceQueen extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Queen;
    pieceType: ChessPieceType = ChessPieceType.Queen;

    getMovesSpecific({ rowIndex, colIndex }: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinateMatrix | undefined)[] = [
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex),
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex, colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex - (1 * direction)),
            chessCoordinateFromMatrix(rowIndex, colIndex - (1 * direction)),
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex - (1 * direction)),
        ];

        for (let coord of multiMoves) {
            if (coord != null) {
                const directionMatrix = [coord.rowIndex - rowIndex, coord.colIndex - colIndex];

                let count = 0;
                let newCoord: ChessCoordinateMatrix | undefined;

                while (true) {
                    newCoord = chessCoordinateFromMatrix(coord.rowIndex + directionMatrix[0] * count, coord.colIndex + directionMatrix[1] * count);
                    if (newCoord == null) break;

                    moves.push(new ChessMoveRaw(newCoord.coordinate));

                    const square = chessBoard.getSquare(newCoord.coordinate);
                    if (square.piece != null) break;

                    count++;
                }
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceRook extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Rook;
    pieceType: ChessPieceType = ChessPieceType.Rook;

    getMovesSpecific({ rowIndex, colIndex }: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinateMatrix | undefined)[] = [
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex),
            chessCoordinateFromMatrix(rowIndex, colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex),
            chessCoordinateFromMatrix(rowIndex, colIndex - (1 * direction)),
        ];

        for (let coord of multiMoves) {
            if (coord != null) {
                const directionMatrix = [coord.rowIndex - rowIndex, coord.colIndex - colIndex];

                let count = 0;
                let newCoord: ChessCoordinateMatrix | undefined;

                while (true) {
                    newCoord = chessCoordinateFromMatrix(coord.rowIndex + directionMatrix[0] * count, coord.colIndex + directionMatrix[1] * count);
                    if (newCoord == null) break;

                    moves.push(new ChessMoveRaw(newCoord.coordinate));

                    const square = chessBoard.getSquare(newCoord.coordinate);
                    if (square.piece != null) break;

                    count++;
                }
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceBishop extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Bishop;
    pieceType: ChessPieceType = ChessPieceType.Bishop;

    getMovesSpecific({ rowIndex, colIndex }: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinateMatrix | undefined)[] = [
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex - (1 * direction)),
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex - (1 * direction)),
        ];

        for (let coord of multiMoves) {
            if (coord != null) {
                const directionMatrix = [coord.rowIndex - rowIndex, coord.colIndex - colIndex];

                let count = 0;
                let newCoord: ChessCoordinateMatrix | undefined;

                while (true) {
                    newCoord = chessCoordinateFromMatrix(coord.rowIndex + directionMatrix[0] * count, coord.colIndex + directionMatrix[1] * count);
                    if (newCoord == null) break;

                    moves.push(new ChessMoveRaw(newCoord.coordinate));

                    const square = chessBoard.getSquare(newCoord.coordinate);
                    if (square.piece != null) break;

                    count++;
                }
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceKnight extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Knight;
    pieceType: ChessPieceType = ChessPieceType.Knight;

    getMovesSpecific({ rowIndex, colIndex }: ChessCoordinateMatrix, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // L
        
        const lMoves: (ChessCoordinateMatrix | undefined)[] = [
            chessCoordinateFromMatrix(rowIndex + (2 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (2 * direction), colIndex + (1 * direction)),
            chessCoordinateFromMatrix(rowIndex - (2 * direction), colIndex - (1 * direction)),
            chessCoordinateFromMatrix(rowIndex + (2 * direction), colIndex - (1 * direction)),
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex + (2 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex + (2 * direction)),
            chessCoordinateFromMatrix(rowIndex - (1 * direction), colIndex - (2 * direction)),
            chessCoordinateFromMatrix(rowIndex + (1 * direction), colIndex - (2 * direction)),
        ];

        for (let coord of lMoves) {
            if (coord != null) moves.push(new ChessMoveRaw(coord.coordinate));
        }

        return moves;
    }
}
