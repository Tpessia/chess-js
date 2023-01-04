import { ChessCoordinate, chessCoordinateFromMatrix } from './ChessCoordinate';
import { ChessPieceBase } from './ChessPiece';

export class ChessSquare {
    rowIndex: number;
    colIndex: number;
    coordinate: ChessCoordinate;

    piece?: ChessPieceBase;

    numberLabel?: string;
    letterLabel?: string;

    constructor(rowIndex: number, colIndex: number, piece?: ChessPieceBase) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.piece = piece;

        this.coordinate = chessCoordinateFromMatrix(rowIndex, colIndex, true)!.coordinate;
        this.numberLabel = colIndex === 0 ? `${rowIndex + 1}` : undefined;
        this.letterLabel = rowIndex === 7 ? 'hgfedcba'[colIndex] : undefined;
    }
}
