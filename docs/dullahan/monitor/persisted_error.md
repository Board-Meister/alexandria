---
sidebar_position: 1
sidebar_label: 'Persisted errors'
---

# Persisted errors

The Monitor Bundles persist unexpected errors with `Trace` entity which holds information about the error, request and
user. Traces can be viewed straight in the database or retrieve with `TraceRepository`.

If you want to extend what exceptions are recorded you can use `TraceServiceInterface` to save additional errors:

```php
try {
    // some error prone code
} catch (\Throwable $e) {
    $this->traceService->create($e);
    // If you want to provide your own request and response object you can pass them to the method
    // but know that TraceService will try to retrieve the last request and last response if
    // one is not provided
    $this->traceService->create($e, $request, $response);

}