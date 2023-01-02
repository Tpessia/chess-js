import { ChessCoordinate, chessCoordinateFromMatrixIndex, chessCoordinateToMatrixIndex } from './ChessCoordinate';
import { ChessPieceSymbol, ChessPieceType } from './ChessPieceType';

export abstract class ChessPieceBase {
    abstract symbol: ChessPieceSymbol;
    abstract pieceType: ChessPieceType;

    abstract getMoves(originCoordinate: ChessCoordinate): ChessCoordinate[][];
}

export class ChessPiecePawn implements ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Pawn;
    pieceType: ChessPieceType = ChessPieceType.Pawn;

    getMoves(originCoordinate: ChessCoordinate) {
        const [cIndex, rIndex] = chessCoordinateToMatrixIndex(originCoordinate);
        const move = [chessCoordinateFromMatrixIndex(cIndex, rIndex + 1), chessCoordinateFromMatrixIndex(cIndex, rIndex + 2)];
        return [move];
    }
}
