---
sidebar_position: 5
sidebar_label: 'Events'
---

# Events

Asset bundle does not implement Event Core completely, yet. But at the current state we are executing most actions
on the event dispatches with few exceptions. Also, no current events are preventable. Here is the list:

- AssetNameEvent
- AssetExistEvent
- ClearAssetEvent
- CloneAssetEvent
- CreateAssetEvent
- FlushAssetEvent
- ListAssetEvent
- MoveAssetEvent
- PostCloneAssetEvent
- PostCreateAssetEvent
- PostMoveAssetEvent
- PostRemoveAssetEvent
- PostReplaceAssetEvent
- PreCloneAssetEvent
- PreCreateAssetEvent
- PreMoveAssetEvent
- PreRemoveAssetEvent
- PreReplaceAssetEvent
- RemoveAssetEvent
- ReplaceAssetEvent
- RetrieveByIdEvent
- RetrieveByPathEvent