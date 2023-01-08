import { calcChessCoordinate } from '@/models/chess/ChessBoardMatrix';
import { ChessBoard } from './ChessBoard';
import { ChessCoordinate, ChessCoordinateCode } from './ChessCoordinate';
import { ChessMove, ChessMoveDirection, ChessMoveRaw } from './ChessMove';
import { ChessPieceColor, ChessPieceName, ChessPieceSymbol, ChessPieceType } from './ChessPieceType';

export abstract class ChessPiece {
    abstract symbol: ChessPieceSymbol;
    abstract type: ChessPieceType;

    color: ChessPieceColor;
    initCoordinate: ChessCoordinateCode;

    constructor(color: ChessPieceColor, initCoordinate: ChessCoordinateCode) {
        this.color = color;
        this.initCoordinate = initCoordinate;
    }

    abstract getMovesSpecific(originCoord: ChessCoordinate, direction: ChessMoveDirection, chessBoard: ChessBoard): ChessMoveRaw[];

    static getName(color: ChessPieceColor, type: ChessPieceType, initCoordinate: ChessCoordinateCode) {
        return `${initCoordinate}${color.toString()}${type}` as ChessPieceName;
    }

    getName() {
        return ChessPiece.getName(this.color, this.type, this.initCoordinate);
    }

    getMoves(originCoord: ChessCoordinate, chessBoard: ChessBoard): ChessMove[] {
        const direction = this.getDirection();
        const rawMoves = this.getMovesSpecific(originCoord, direction, chessBoard);
        const moves: ChessMove[] = [];

        for (let move of rawMoves) {
            // FILTER

            const targetSquare = chessBoard.getSquare(move.targetCoordinate);
            const capture = targetSquare.piece;
    
            // Piece of same color
            if (capture?.color === this.color) continue;

            // MAP

            moves.push(new ChessMove(this, originCoord, move.targetCoordinate, capture, move.sideEffects));
        }
        
        return moves;
    }

    getMovesHist(chessBoard: ChessBoard) {
        return chessBoard.movesIndex[this.getName()] ?? [];
    }

    getDirection() {
        return this.color === ChessPieceColor.White ? -1 : 1;
    }
}

export class ChessPiecePawn extends ChessPiece {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Pawn;
    type: ChessPieceType = ChessPieceType.Pawn;

    getMovesSpecific(originCoord: ChessCoordinate, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Forward

        const forwardSquare = chessBoard.getSquareByIndex(originCoord.rowIndex + (1 * direction), originCoord.colIndex);

        if (forwardSquare != null && forwardSquare.piece == null)
            moves.push(new ChessMoveRaw(forwardSquare.coordinate));

        // Double Forward

        if (this.getMovesHist(chessBoard).length === 0) {
            const doubleForwardSquare = chessBoard.getSquareByIndex(originCoord.rowIndex + (2 * direction), originCoord.colIndex);
            if (doubleForwardSquare != null && doubleForwardSquare.piece == null)
                moves.push(new ChessMoveRaw(doubleForwardSquare.coordinate));
        }

        // Diagonal
       
        const diagonalRightSquare = chessBoard.getSquareByIndex(originCoord.rowIndex + (1 * direction), originCoord.colIndex + (1 * direction));
        if (diagonalRightSquare != null && diagonalRightSquare?.piece != null && diagonalRightSquare?.piece?.color !== this.color)
            moves.push(new ChessMoveRaw(diagonalRightSquare.coordinate));

        const diagonalLeftSquare = chessBoard.getSquareByIndex(originCoord.rowIndex + (1 * direction), originCoord.colIndex - (1 * direction));
        if (diagonalLeftSquare != null && diagonalLeftSquare?.piece != null && diagonalLeftSquare?.piece?.color !== this.color)
            moves.push(new ChessMoveRaw(diagonalLeftSquare.coordinate));

        // Moves

        return moves;
    }
}

export class ChessPieceKing extends ChessPiece {
    symbol: ChessPieceSymbol = ChessPieceSymbol.King;
    type: ChessPieceType = ChessPieceType.King;

    getMovesSpecific(coord: ChessCoordinate, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Single

        const singleMoves: (ChessCoordinate | undefined)[] = [
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex),
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex, coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex - (1 * direction)),
            calcChessCoordinate(coord.rowIndex, coord.colIndex - (1 * direction)),
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex - (1 * direction)),
        ];

        for (let singleCoord of singleMoves) {
            if (singleCoord != null) moves.push(new ChessMoveRaw(singleCoord));
        }

        // Castling

        if (this.getMovesHist(chessBoard).length === 0) {
            // Queenside Castling

            const queenRookSquare = chessBoard.getSquareByCode(this.color === ChessPieceColor.White ? ChessCoordinateCode.a1 : ChessCoordinateCode.a8);

            if (queenRookSquare.piece?.getMovesHist(chessBoard)?.length === 0) {
                const path = chessBoard.projectPath(coord, queenRookSquare.coordinate);
                const isPathClear = path.length === 4 && path.slice(0, 3).every(e => chessBoard.getSquareByCode(e.code).piece == null);

                if (isPathClear) {
                    const queenBishopSquare = chessBoard.getSquare(path[0]);
                    const queenKnightSquare = chessBoard.getSquare(path[1]);

                    const rookSideEffect = new ChessMove(queenRookSquare.piece, queenRookSquare.coordinate, queenBishopSquare.coordinate);
                    moves.push(new ChessMoveRaw(queenKnightSquare.coordinate, [rookSideEffect]));
                }
            }

            // Kingside Castling

            const kingRookSquare = chessBoard.getSquareByCode(this.color === ChessPieceColor.White ? ChessCoordinateCode.h1 : ChessCoordinateCode.h8);

            if (kingRookSquare.piece?.getMovesHist(chessBoard)?.length === 0) {
                const path = chessBoard.projectPath(coord, kingRookSquare.coordinate);
                const isPathClear = path.length === 3 && path.slice(0, 2).every(e => chessBoard.getSquareByCode(e.code).piece == null);

                if (isPathClear) {
                    const kingBishopSquare = chessBoard.getSquare(path[0]);
                    const kingKnightSquare = chessBoard.getSquare(path[1]);

                    const rookSideEffect = new ChessMove(kingRookSquare.piece, kingRookSquare.coordinate, kingBishopSquare.coordinate);
                    moves.push(new ChessMoveRaw(kingKnightSquare.coordinate, [rookSideEffect]));
                }
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceQueen extends ChessPiece {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Queen;
    type: ChessPieceType = ChessPieceType.Queen;

    getMovesSpecific(coord: ChessCoordinate, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        // TODO: promote to queen

        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinate | undefined)[] = [
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex),
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex, coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex - (1 * direction)),
            calcChessCoordinate(coord.rowIndex, coord.colIndex - (1 * direction)),
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex - (1 * direction)),
        ];

        for (let multiCoord of multiMoves) {
            if (multiCoord != null) {
                const path = chessBoard.projectPath(coord, multiCoord);
                path.forEach(e => moves.push(new ChessMoveRaw(e)));
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceRook extends ChessPiece {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Rook;
    type: ChessPieceType = ChessPieceType.Rook;

    getMovesSpecific(coord: ChessCoordinate, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinate | undefined)[] = [
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex),
            calcChessCoordinate(coord.rowIndex, coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex),
            calcChessCoordinate(coord.rowIndex, coord.colIndex - (1 * direction)),
        ];

        for (let multiCoord of multiMoves) {
            if (multiCoord != null) {
                const path = chessBoard.projectPath(coord, multiCoord);
                path.forEach(e => moves.push(new ChessMoveRaw(e)));
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceBishop extends ChessPiece {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Bishop;
    type: ChessPieceType = ChessPieceType.Bishop;

    getMovesSpecific(coord: ChessCoordinate, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // Multi

        const multiMoves: (ChessCoordinate | undefined)[] = [
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex - (1 * direction)),
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex - (1 * direction)),
        ];

        for (let multiCoord of multiMoves) {
            if (multiCoord != null) {
                const path = chessBoard.projectPath(coord, multiCoord);
                path.forEach(e => moves.push(new ChessMoveRaw(e)));
            }
        }

        // Moves

        return moves;
    }
}

export class ChessPieceKnight extends ChessPiece {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Knight;
    type: ChessPieceType = ChessPieceType.Knight;

    getMovesSpecific(coord: ChessCoordinate, direction: ChessMoveDirection, chessBoard: ChessBoard) {
        const moves: ChessMoveRaw[] = [];

        // L
        
        const lMoves: (ChessCoordinate | undefined)[] = [
            calcChessCoordinate(coord.rowIndex + (2 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (2 * direction), coord.colIndex + (1 * direction)),
            calcChessCoordinate(coord.rowIndex - (2 * direction), coord.colIndex - (1 * direction)),
            calcChessCoordinate(coord.rowIndex + (2 * direction), coord.colIndex - (1 * direction)),
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex + (2 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex + (2 * direction)),
            calcChessCoordinate(coord.rowIndex - (1 * direction), coord.colIndex - (2 * direction)),
            calcChessCoordinate(coord.rowIndex + (1 * direction), coord.colIndex - (2 * direction)),
        ];

        for (let lCoord of lMoves) {
            if (lCoord != null) moves.push(new ChessMoveRaw(lCoord));
        }

        return moves;
    }
}
