// src/app/components/update-user/update-user.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  userData: User = new User();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(id: string) {
    this.authService.getUsers().subscribe(
      (users: User[]) => {
        const user = users.find((u: User) => u._id === id); // Type spécifié pour `u`
        if (user) {
          this.userData = user;
        }
      },
      error => console.error('Error loading user', error)
    );
  }

  updateUser() {
    this.authService.updateUser(this.userData._id!, this.userData).subscribe(
      response => {
        console.log('User updated', response);
        this.router.navigate(['/user-list']);
      },
      error => console.error('Update error', error)
    );
  }
}
