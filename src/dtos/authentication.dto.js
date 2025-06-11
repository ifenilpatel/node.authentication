class AuthenticationDTO {
  constructor(item) {
    this.user_id = item.user_id ?? 0;
    this.fullname = item.fullname ?? '';
    this.email = item.email ?? '';
    this.is_email_verified = item.is_email_verified ?? false;
    this.password = item.password ?? '';
  }
}

export default AuthenticationDTO;
