// eslint-disable-next-line import/prefer-default-export
export async function wait(seconds) {
  if (!Number.isInteger(seconds)) {
    throw new Error("seconds parameter should be a number");
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, [seconds]);
  });
}
