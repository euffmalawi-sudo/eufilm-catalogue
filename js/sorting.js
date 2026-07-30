export function applySort(films, sortType) {
    const sorted = [...films];
    switch(sortType) {
        case 'title':
            sorted.sort((a,b) => a.title.localeCompare(b.title));
            break;
        case 'year':
            sorted.sort((a,b) => b.year - a.year);
            break;
        case 'runtime':
            sorted.sort((a,b) => a.runtime - b.runtime);
            break;
        case 'combined':
        default:
            sorted.sort((a,b) => b.combined - a.combined);
            break;
    }
    return sorted;
}