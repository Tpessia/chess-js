import { ChessCoordinate, chessCoordinateFromMatrixIndex } from './ChessCoordinate';
import { ChessPieceBase } from './ChessPiece';

export class ChessSquare {
    cIndex: number;
    rIndex: number;
    coordinate: ChessCoordinate;

    piece?: ChessPieceBase;

    numberLabel?: string;
    letterLabel?: string;

    constructor(cIndex: number, rIndex: number) {
        this.cIndex = cIndex;
        this.rIndex = rIndex;
        this.coordinate = chessCoordinateFromMatrixIndex(cIndex, rIndex);
        this.numberLabel = cIndex === 0 ? `${rIndex + 1}` : undefined;
        this.letterLabel = rIndex === 7 ? 'hgfedcba'[cIndex] : undefined;
    }
}
