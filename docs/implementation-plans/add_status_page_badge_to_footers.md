# Add Status Page Badge to Footers

The user wants to add a status page badge to the footer of the "client" and "admin" interfaces. The badge link is provided as:
```html
<a href="https://infobrasil.statuspage.one" target="_blank" rel="noopener noreferrer">
  <img src="https://infobrasil.statuspage.one/api/badges/y2ul8rc3g6khxun31ehbzivk" alt="InfoBrasil Status Status" />
</a>
```

## Proposed Changes

### Integration Request Templates

I will update the following HTML templates to include the badge in their respective footers.

#### [MODIFY] [client.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/client.html)
Add the badge link inside the `.footer-links` div.

#### [MODIFY] [admin.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/admin.html)
Add the badge link inside the `.footer-links` div.

## Verification Plan

### Manual Verification
- Verify the HTML structure in the modified files.
