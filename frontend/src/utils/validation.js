export const validateBlog = ({ title, content }) => {
    const errors = {
        title: '',
        content: '' 
    }

    const trimmedTitle = title.trim();
    let hasError = false

    if (!trimmedTitle) {
        errors.title = 'Title is required';
        hasError = true
    } else if (trimmedTitle.length < 5) {
        errors.title = 'Title must be at least 5 characters long';
        hasError = true
    } else if (trimmedTitle.length > 100) {
        errors.title = 'Title must be less than 100 characters long';
        hasError = true
    }

    if (!content) {
        errors.content = 'Content is required';
        hasError = true
    }
    else if (content < 10) {
        errors.content = 'Content must be at least 10 characters long';
        hasError = true
    }

    return hasError ? errors : null
}