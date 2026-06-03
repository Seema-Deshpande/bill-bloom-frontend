import { useDispatch, useSelector} from 'react-redux';
import {
    login as loginUserAction,
    logout as logoutAction,
} from '../reducers/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);

    return {
        token,
        user,
        loginUser: (data) => dispatch(loginUserAction(data)),
        logout: () => dispatch(logoutAction())
    }
}
