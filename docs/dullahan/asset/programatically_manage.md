---
sidebar_position: 3
sidebar_label: 'Manage interfaces'
---

# Manage interfaces

For programmatic use of the Asset Bundle we have set few interfaces:

- AssetServiceInterface
- AssetSerializerInterface
- AssetFileManagerInterface
- AssetMiddlewareInterface

and `Asset` aggregator you can use to manage most actions.

They give the needed abstraction for managing your assets.

## Asset aggregate

Asset aggregate is made from three object:
- Structure - defines information about the asset like path, name, type
- Entity - the actual object representing information in database
- Context - additional necessary information

## Create new asset

```php
use Dullahan\Asset\Port\Presentation\AssetServiceInterface;
use Dullahan\Asset\Domain\File;
use Dullahan\Asset\Domain\Asset;
use Dullahan\Asset\Port\Presentation\AssetMiddlewareInterface;

/**
 * @phpstan-import-type AssetSerialized from \Dullahan\Asset\Port\Presentation\AssetSerializerInterface
 */
class CreateAssetExample {
    public function __construct(
        private AssetServiceInterface $assetService,
        private AssetMiddlewareInterface $assetMiddleware,
    ) {
    }

    public function uploadAsset(): Asset
    {
        $filepath = '/path/to/resource.png';
        $file = new File(
            path: '/example',
            name: 'new_image',
            originalName: 'example',
            resource: fopen(filepath),
            size: (int) filesize(filepath),
            extension: 'png',
            mimeType: 'image/png',
        );

        $asset = $this->assetService->create($file);
        $this->assetService->flush();

        return asset;
    }

    /**
     * @return AssetSerialized
     */
    public function uploadAssetUsingMiddleware(): array
    {
        return $this->assetMiddleware->upload(
            name: 'new_image',
            path: '/example',
            resource: fopen(filepath),
            originalName: 'example',
            size: (int) filesize(filepath),
            extension: 'png',
            mimeType: 'image/png',
        );
    }
}
```


## Create new folder

```php
use Dullahan\Asset\Domain\Directory;
use Dullahan\Asset\Port\Presentation\AssetServiceInterface;
use Dullahan\Asset\Domain\Asset;
use Dullahan\Asset\Port\Presentation\AssetMiddlewareInterface;

class CreateFolderExample {
    public function __construct(
        private AssetServiceInterface $assetService,
        private AssetMiddlewareInterface $assetMiddleware,
    ) {
    }

    public function createFolder(): Asset
    {
        $asset = $this->assetService->create(new Directory('/newFolder'));
        $this->assetService->flush();

        return asset;
    }

    /**
     * @return AssetSerialized
     */
    public function createFolderUsingMiddleware(): array
    {
        return $this->assetMiddleware->folder('/', 'newFolder'),
    }
}
```
