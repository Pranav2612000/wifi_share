## TODO

- Ensure nothing has broken on webversion of the app [ DONE ]
- Interface for switching on/off - try out type radio context menu or maintain state and only show one of ON/OFF menu item
    Going ahead with normal buttons for now. OFF shown if the app is in ON state and ON shown if the app is in OFF state. [ DONE ]
    Use chrome storage for storing app state ( ON / OFF ) [ DONE ]
    Ensure proper state updates when the button is clicked [ DONE ]
    Add App ON/OFF badge on the Icon
    Improve Popup in OFF state - the default one should not show.

- Run the app when toggle ON is clicked. Discovery service should connect [ DONE ] 
- Stop the discovery service when the app is toggled OFF
- When in ON state, new connections should not be started when the popup is opened
