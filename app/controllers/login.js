import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class LoginController extends Controller {
  @service session;
}
