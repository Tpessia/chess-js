import { ChessMove } from '@/models/chess/ChessMove';

export enum ChessCheckType {
    Check = 'Check',
    Checkmate = 'Checkmate',
    Stalemate = 'Stalemate',
}

export enum ChessCheckMoveType {
    KingMove = 'KingMove',
    PieceKill = 'PieceKill',
    PieceObstruction = 'PieceObstruction',
}

export interface ChessCheck {
    type: ChessCheckType;
    safeMoves: ChessCheckSafeMove[];
}

export interface ChessCheckSafeMove {
    type: ChessCheckMoveType;
    move: ChessMove;
}
