//HELPER FUNCTIONS
export function formatDate(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return formattedDate;
}

export function hasErrors(errors) {
    return Object.values(errors).some(error => {
        return error !== ''
    })
}


export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}