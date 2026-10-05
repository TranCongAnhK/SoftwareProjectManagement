package com.optigym.shared.web;

import java.util.Map;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class RequestValues {

  public static String str(Map<String, Object> b, String key) {
    return Objects.toString(b.getOrDefault(key, ""), "").trim();
  }

  public static void bad(String message) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
  }
}
