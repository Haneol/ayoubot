const HelpView = require("../views/helpView");

exports.help = (msg) => {
  const helpView = new HelpView(msg);
  helpView.sendEmbededMsg();
};
