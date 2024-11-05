import constants from '../config/constants';

export default function constant(constantName) {
  const path = constantName.split('.');
  return path.reduce((acc, pathKey) => acc[pathKey], constants);
}
