import { ChessCoordinate } from './ChessCoordinate';
import { ChessPieceBase } from './ChessPiece';

export class ChessMove {
    piece: ChessPieceBase;
    originCoordinate: ChessCoordinate;
    targetCoordinate: ChessCoordinate;
    capture?: ChessPieceBase;

    constructor(piece: ChessPieceBase, originCoordinate: ChessCoordinate, targetCoordinate: ChessCoordinate, capture?: ChessPieceBase) {
        this.piece = piece;
        this.originCoordinate = originCoordinate;
        this.targetCoordinate = targetCoordinate;
        this.capture = capture;
    }
}
