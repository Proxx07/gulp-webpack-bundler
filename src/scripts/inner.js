// Inner page scripts
import { burgerMenu } from './modules/navigation';

import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

new AirDatepicker('#datepicker');
burgerMenu(['.header nav ul', '.sidebar nav ul']);
