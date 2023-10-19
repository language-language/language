# Example

```fox
use github.com/fox-language/dep as Dep
use github.com/fox-language/dep (
  Subdir
  Otherdir as Renamed
)

lang go {
  import (
    "os"
  )
} lang nodejs {

} lang deno {

} lang python {
  import os
} lang sh {

}

fn GetEnv(@Key string) value, exists {
  lang go {
    env, isThere := os.LookupEnv(@Key)
    return env, isThere
  } lang nodejs {
    const value = process.env[@Key]
    if (value === void 0) {
      return value, true
    } else {
      return ['', false]
    }
  } lang deno {
    const value = Deno.env.get(@Key);
    if (value === void 0) {
      return value, true;
    } else {
      return ["", false]
    }
  } lang python {
    value = os.environ.get(@Key)
    if value == None:
      return (value, True)
    else:
      return ('', False)
  } lang sh {
    unset -v REPLY{1,2}

    if printenv @Key; then
      REPLY1=$@Key
      REPLY2=yes
    else
      REPLY1=
      REPLY2=no
    fi
  }
}
```
