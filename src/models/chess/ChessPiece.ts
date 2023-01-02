import { ChessCoordinate, chessCoordinateFromMatrixIndex, chessCoordinateToMatrixIndex } from './ChessCoordinate';
import { ChessPieceColor, ChessPieceSymbol, ChessPieceType } from './ChessPieceType';

export abstract class ChessPieceBase {
    abstract symbol: ChessPieceSymbol;
    abstract pieceType: ChessPieceType;
    color: ChessPieceColor;

    constructor(color: ChessPieceColor) {
        this.color = color;
        console.log('color',color,this)
    }

    abstract getMoves(originCoordinate: ChessCoordinate): ChessCoordinate[][];
}

export class ChessPiecePawn extends ChessPieceBase {
    symbol: ChessPieceSymbol = ChessPieceSymbol.Pawn;
    pieceType: ChessPieceType = ChessPieceType.Pawn;
    color!: ChessPieceColor;

    constructor(color: ChessPieceColor) {
        super(color);
        this.color = color; // TODO: fix set from parent ctor
        console.log('color2',color,this)
    }

    getMoves(originCoordinate: ChessCoordinate) {
        const [rIndex, cIndex] = chessCoordinateToMatrixIndex(originCoordinate);
        const move = [chessCoordinateFromMatrixIndex(rIndex + 1, cIndex), chessCoordinateFromMatrixIndex(rIndex + 2, cIndex)];
        return [move];
    }
}
