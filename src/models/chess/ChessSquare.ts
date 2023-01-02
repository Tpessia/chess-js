import { ChessCoordinate, chessCoordinateFromMatrixIndex } from './ChessCoordinate';
import { ChessPieceBase } from './ChessPiece';

export class ChessSquare {
    rIndex: number;
    cIndex: number;
    coordinate: ChessCoordinate;

    piece?: ChessPieceBase;

    numberLabel?: string;
    letterLabel?: string;

    constructor(rIndex: number, cIndex: number) {
        this.rIndex = rIndex;
        this.cIndex = cIndex;
        this.coordinate = chessCoordinateFromMatrixIndex(rIndex, cIndex);
        this.numberLabel = cIndex === 0 ? `${rIndex + 1}` : undefined;
        this.letterLabel = rIndex === 7 ? 'hgfedcba'[cIndex] : undefined;
    }
}
