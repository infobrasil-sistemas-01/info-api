export function ids(id: number) {
  if (id === 99) {
    return process.env.P99!;
  }
  if (id === 131) {
    return process.env.P131!;
  }
  if (id === 104) {
    return process.env.P104!;
  }
}
