import { create } from 'zustand';

interface User {
    _id: string,
    email: string,
    fullname: string,
    profile?: string,
};

interface Chat {
    prompt: string,
    response: string
};

interface UserStore {
    user: User,
    chat: Chat[],
    setUser: (user: User) => void,
    setChat: (chat: Chat[]) => void,
};

const userStore = create<UserStore>()( set => {
    return {
        user: {
            _id: "",
            email: "",
            fullname: "",
            profile: ""
        },
        chat: [],
        setUser: (user: User) => set({user}),
        setChat: (chat) => set({chat}),
    }
});

export default userStore;