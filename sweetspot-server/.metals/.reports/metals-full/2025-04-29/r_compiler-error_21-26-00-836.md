file://<WORKSPACE>/src/main/java/com/sweetspot/server/user/UserDTO.java
### java.util.NoSuchElementException: next on empty iterator

occurred in the presentation compiler.

presentation compiler configuration:


action parameters:
uri: file://<WORKSPACE>/src/main/java/com/sweetspot/server/user/UserDTO.java
text:
```scala
package com.sweetspot.server.user;

import java.time.LocalDateTime;

public class UserDTO {
    private Long userId; // 사용자 고유 ID
    private String email; // 이메일
    private String password; // 비밀번호
    private String nickname; // 닉네임
    private String phoneNumber; // 전화번호
    private boolean isPhoneVerified; // 전화번호 인증 여부
    private LocalDateTime createdAt; // 가입일

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getEmail() { return email; } 
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; } 
    public void setPassword(String password) { this.password = password; }
    
    public String getNickname() { return nickname; } 
    public void setNickname(String nickname) { this.nickname = nickname; }
    
    public String getPhoneNumber() { return phoneNumber; } 
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public boolean isPhoneVerified() { return isPhoneVerified; } 
    public void setPhoneVerified(boolean isPhoneVerified) { this.isPhoneVerified = isPhoneVerified; }
    
    public LocalDateTime getCreatedAt() { return createdAt; } 
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // 추가적인 생성자나 메서드 등을 필요에 따라 추가할 수 있ㄷ
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
	dotty.tools.pc.WithCompilationUnit.<init>(WithCompilationUnit.scala:31)
	dotty.tools.pc.SimpleCollector.<init>(PcCollector.scala:351)
	dotty.tools.pc.PcSemanticTokensProvider$Collector$.<init>(PcSemanticTokensProvider.scala:63)
	dotty.tools.pc.PcSemanticTokensProvider.Collector$lzyINIT1(PcSemanticTokensProvider.scala:63)
	dotty.tools.pc.PcSemanticTokensProvider.Collector(PcSemanticTokensProvider.scala:63)
	dotty.tools.pc.PcSemanticTokensProvider.provide(PcSemanticTokensProvider.scala:88)
	dotty.tools.pc.ScalaPresentationCompiler.semanticTokens$$anonfun$1(ScalaPresentationCompiler.scala:111)
```
#### Short summary: 

java.util.NoSuchElementException: next on empty iterator