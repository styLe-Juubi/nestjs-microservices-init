export const errorMessage400 = ( message: object[] ) => {
    return {
        statusCode: 400,
        message,
        error: 'Bad Request',
    }
}