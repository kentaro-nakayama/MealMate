// APIエラーなど、任意の例外からユーザーに表示するメッセージを取り出す
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
};
