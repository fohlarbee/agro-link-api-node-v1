import { Injectable } from "@nestjs/common";

@Injectable()
export class PasswordService {
  constructor() {}

  async randomPass() {
    const words = [
      "apple",
      "banana",
      "cherry",
      "date",
      "elderberry",
      "fig",
      "grape",
      "honeydew",
      "kiwi",
      "lemon",
      "mango",
      "nectarine",
      "orange",
      "pear",
      "plum",
      "quince",
      "raspberry",
      "strawberry",
      "tomato",
      "ugli",
      "vanilla",
      "watermelon",
      "xigua",
      "yellow",
      "zucchini",
    ];

    const digits = "0123456789";

    let passphrase = "";

    for (let i = 0; i < 3; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      const randomIndex = Math.floor(Math.random() * word.length);
      const digit = digits[Math.floor(Math.random() * digits.length)];
      passphrase +=
        word.slice(0, randomIndex) + digit + word.slice(randomIndex + 1);
    }

    return passphrase.trim();
  }
}
