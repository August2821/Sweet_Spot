file://<WORKSPACE>/src/main/java/com/sweetspot/server/user/UserController.java
### java.util.NoSuchElementException: next on empty iterator

occurred in the presentation compiler.

presentation compiler configuration:


action parameters:
offset: 1595
uri: file://<WORKSPACE>/src/main/java/com/sweetspot/server/user/UserController.java
text:
```scala
package com.sweetspot.server.user;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    //@Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 사용자 등록 API
    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(@RequestBody UserDTO userDTO) {
        try {
            UserEntity userEntity = userService.registerUser(userDTO);
            return new ResponseEntity<>(userEntity, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /*
    // 이메일로 사용자 조회 API
    @GetMapping("/email/{email}")
    public ResponseEntity<UserEntity> getUserByEmail(@PathVariable String email) {
        UserEntity userEntity = userService.getUserByEmail(email);
        if (userEntity != null) {
            return new ResponseEntity<>(userEntity, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // 전화번호로 사용자 조회 API
    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<UserEntity> getUserByPhoneNumber(@PathVariable String phoneNumber) {
        UserEntity userEntity = userService.getUserByPhoneNumber(phoneNumber);
        if (userEntity != null) @@{
            return new ResponseEntity<>(userEntity, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // 사용자 정보 업데이트 API
    @PutMapping("/{userId}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        try {
            UserEntity updatedUser = userService.updateUser(userId, userDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
     */
}

```



#### Error stacktrace:

```
scala.collection.Iterator$$anon$19.next(Iterator.scala:973)
	scala.collection.Iterator$$anon$19.next(Iterator.scala:971)
	scala.collection.mutable.MutationTracker$CheckedIterator.next(MutationTracker.scala:76)
	scala.collection.IterableOps.head(Iterable.scala:222)
	scala.collection.IterableOps.head$(Iterable.scala:222)
	scala.collection.AbstractIterable.head(Iterable.scala:935)
	dotty.tools.dotc.interactive.InteractiveDriver.run(InteractiveDriver.scala:164)
	dotty.tools.pc.CachingDriver.run(CachingDriver.scala:45)
	dotty.tools.pc.HoverProvider$.hover(HoverProvider.scala:40)
	dotty.tools.pc.ScalaPresentationCompiler.hover$$anonfun$1(ScalaPresentationCompiler.scala:389)
```
#### Short summary: 

java.util.NoSuchElementException: next on empty iterator