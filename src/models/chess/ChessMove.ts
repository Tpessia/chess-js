import { ChessCoordinate } from './ChessCoordinate';
import { ChessPiece } from './ChessPiece';

export type ChessMoveDirection = 1 | -1;

export class ChessMove {
    piece: ChessPiece;
    originCoordinate: ChessCoordinate;
    targetCoordinate: ChessCoordinate;
    capture?: ChessPiece;
    sideEffects?: ChessMove[];

    constructor(piece: ChessPiece, originCoordinate: ChessCoordinate, targetCoordinate: ChessCoordinate, capture?: ChessPiece, sideEffects?: ChessMove[]) {
        this.piece = piece;
        this.originCoordinate = originCoordinate;
        this.targetCoordinate = targetCoordinate;
        this.capture = capture;
        this.sideEffects = sideEffects;
    }

    // Utils

    toString() { // Needed for memoize
        return `${this.piece.symbol}${this.capture != null ? 'x' : ''}${this.targetCoordinate.code}`;
    }
}

export class ChessMoveRaw {
    targetCoordinate: ChessCoordinate;
    sideEffects?: ChessMove[];

    constructor(targetCoordinate: ChessCoordinate, sideEffects?: ChessMove[]) {
        this.targetCoordinate = targetCoordinate;
        this.sideEffects = sideEffects;
    }
}
