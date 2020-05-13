import {
  Message
} from 'element-ui';

export function resultErr(meta, status, message) {
  if (meta.status !== status) {
    Message.error(message + ',' + meta.msg);
    return 0;
  }
  return 1;

}