// Copyright © 2026 Christopher Snow
unsigned long label_length(const unsigned char *label, unsigned long capacity)
{
    unsigned long length = 0;
    while (length < capacity) {
        if (label[length] == 0) break;
        length++;
    }
    return length;
}
