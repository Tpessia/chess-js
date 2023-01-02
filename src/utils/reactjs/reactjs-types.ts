export type Dispatch<A> = (value: A) => void;
export type DispatchWithoutAction = () => void;
export type SetStateFunction<S> = (prevState: S) => S;
export type SetStateParam<S> = S | SetStateFunction<S>;
export type SetState<S> = Dispatch<SetStateParam<S>>;
export type UseState<S> = [S, SetStateParam<S>];
export type InitialState<S> = S | (() => S);