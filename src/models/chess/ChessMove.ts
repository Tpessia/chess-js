import { ChessCoordinate } from './ChessCoordinate';
import { ChessPieceBase } from './ChessPiece';

export type ChessMoveDirection = 1 | -1;

export enum ChessMoveWarning {
    Check = 'Check',
    Checkmate = 'Checkmate',
    Stalemate = 'Stalemate',
}

export class ChessMove {
    piece: ChessPieceBase;
    originCoordinate: ChessCoordinate;
    targetCoordinate: ChessCoordinate;
    capture?: ChessPieceBase;
    sideEffects?: ChessMove[];

    constructor(piece: ChessPieceBase, originCoordinate: ChessCoordinate, targetCoordinate: ChessCoordinate, capture?: ChessPieceBase, sideEffects?: ChessMove[]) {
        this.piece = piece;
        this.originCoordinate = originCoordinate;
        this.targetCoordinate = targetCoordinate;
        this.capture = capture;
        this.sideEffects = sideEffects;
    }

    toString() {
        return `${this.piece.symbol}${this.capture ? 'x' : ''}${this.targetCoordinate}`;
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
