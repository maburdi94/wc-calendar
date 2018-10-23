# wc-calendar
Interactive Web Components Calendar w/ Event Model


Event Model:
```json
"date-select': {
    ..., 
    "detail": {
        "date": ___
    }
}
```

Listener:
```javascript
document.querySelector('wc-calendar').addEventListener('date-select', e => {
  alert(e.detail['date']);
})
```


### **[Demo \(JSFiddle\)](https://jsfiddle.net/quwd0nfe/)**
