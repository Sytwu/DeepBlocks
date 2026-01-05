import { ExampleProject } from '../types/example';
import { mnistExample } from './mnist';
import { simpleCNNExample } from './simpleCNN';

export const examples: ExampleProject[] = [
    mnistExample,
    simpleCNNExample,
];

export { mnistExample, simpleCNNExample };
