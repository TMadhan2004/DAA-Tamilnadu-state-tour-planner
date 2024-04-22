export const floydWarshallWithPath = (adjacencyMatrix) => {
  const numVertices = adjacencyMatrix.length;
  let dist = Array.from({ length: numVertices }, () => Array(numVertices).fill(Infinity));
  let next = Array.from({ length: numVertices }, () => Array(numVertices).fill(null));

  // Initialize distance and next matrices
  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < numVertices; j++) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (adjacencyMatrix[i][j] > 0) {
        dist[i][j] = adjacencyMatrix[i][j];
        next[i][j] = j;
      }
    }
  }

  // Floyd-Warshall algorithm with path reconstruction
  for (let k = 0; k < numVertices; k++) {
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Function to reconstruct the path from source to destination
  const constructPath = (startIdx, endIdx) => {
    if (next[startIdx][endIdx] === null) return []; // No path
    let path = [startIdx];
    while (startIdx !== endIdx) {
      startIdx = next[startIdx][endIdx];
      path.push(startIdx);
    }
    return path;
  };

  return { dist, constructPath };
};
