## Inputs

| Parameter      | Description                                                       | Required | Default               |
|----------------|-------------------------------------------------------------------|----------|-----------------------|
| `github_token` | A Github token, usually `${{ github.token }}`.                    | N        | `${{ github.token }}` |
| `repo_path`    | Provide a "owner/repo" string for fetching from a different repo. | N        | The current repo      |

## Output

- `tag_name`: The name of the release's Git tag (0.0.0 if not exists)

## Usage

```yaml
steps:
  - id: fetch-latest-release
    uses: thebritican/fetch-latest-release@v1
    with:
      github_token: ${{ github.token }}
```

