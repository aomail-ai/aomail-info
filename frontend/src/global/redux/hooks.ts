import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "./store"; // Adjust paths as necessary

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
