export function applyFilters(films, search, eventFilter, genreFilter) {
    return films.filter(film => {
        // Search
        const matchSearch = !search ||
            film.title.toLowerCase().includes(search) ||
            film.director.toLowerCase().includes(search) ||
            film.country.toLowerCase().includes(search);

        // Event
        const matchEvent = eventFilter === 'all' || film.eventSuggestion === eventFilter;

        // Genre
        const matchGenre = genreFilter === 'all' || film.genres.includes(genreFilter);

        return matchSearch && matchEvent && matchGenre;
    });
}