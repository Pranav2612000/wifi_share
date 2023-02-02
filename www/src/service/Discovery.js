let instance; // used for singleton pattern

class DiscoveryService {
  constructor() {
    if (instance) {
        return instance;
    }

    instance = this;
  }

  setup() {
    console.log('Setting up peer');
  }

  find() {
    console.log('Looking for peers...');
  }

  kill() {
      console.log('Exiting...');
      console.log('Unpublishing all and destroy');
  }
}
export default DiscoveryService;
