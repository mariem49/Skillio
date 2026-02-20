package esprit.subscription.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class subb {
   private long userId;
    private String userRole;
    private Long planId;
    private String billingCycle;
}
