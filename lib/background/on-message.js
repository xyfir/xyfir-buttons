export default function(data, sender, respond) {

  switch (data.action) {
    case 'get tab id':
      respond(sender.tab.id);
      break;
    
    default:
      respond();
  }

  return true; // respond() might by async

}