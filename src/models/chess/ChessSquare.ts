import { calcChessCoordinate } from '@/models/chess/ChessBoardMatrix';
import { ChessCoordinate } from './ChessCoordinate';
import { ChessPiece } from './ChessPiece';

export class ChessSquare {
    coordinate: ChessCoordinate;

    piece?: ChessPiece;

    numberLabel: string;
    letterLabel: string;

    constructor(rowIndex: number, colIndex: number, piece?: ChessPiece) {
        this.piece = piece;

        this.coordinate = calcChessCoordinate(rowIndex, colIndex, true)!;
        this.numberLabel = `${8 - rowIndex}`;
        this.letterLabel = 'abcdefgh'[colIndex];
    }
}
