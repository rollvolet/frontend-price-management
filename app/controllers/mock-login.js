import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class MockLoginController extends Controller {
  @service session;
}
