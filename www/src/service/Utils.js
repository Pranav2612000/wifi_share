export async function wait(seconds) {
  if (!Number.isInteger(seconds)) {
    return;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, [seconds]);
  });
}
