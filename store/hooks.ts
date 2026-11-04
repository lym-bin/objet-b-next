//store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// 장부 모양을 아는 버전(이 컴포넌트에서는 이 두개만 씀)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>(); // 창구 타입
export const useAppSelector = useSelector.withTypes<RootState>(); // 장부 안 전체 타입
